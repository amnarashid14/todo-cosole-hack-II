/**
 * Performance monitoring utilities for authentication flows
 */

export interface AuthFlowMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
  flowType: 'login' | 'registration' | 'logout' | 'password-reset';
}

class PerformanceMonitor {
  private metrics: AuthFlowMetrics[] = [];

  startFlow(flowType: AuthFlowMetrics['flowType'], id?: string): string {
    const metricId = id || `auth-flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const metric: AuthFlowMetrics = {
      startTime: performance.now(),
      success: true,
      flowType,
    };

    // Store temporarily in memory
    (window as any)[metricId] = metric;

    return metricId;
  }

  endFlow(id: string, success: boolean, error?: string) {
    const metric: AuthFlowMetrics | undefined = (window as any)[id];

    if (!metric) {
      console.warn('Performance metric not found:', id);
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = success;

    if (error) {
      metric.error = error;
    }

    // Store the completed metric
    this.metrics.push(metric);

    // Log to console for development (in a real app, send to analytics service)
    console.group(`%c${metric.flowType} flow ${success ? '✅' : '❌'}`,
      `color: ${success ? 'green' : 'red'}; font-weight: bold;`);
    console.log(`Duration: ${metric.duration?.toFixed(2)}ms`);
    if (error) {
      console.log(`Error: ${error}`);
    }
    console.groupEnd();

    // Clean up
    delete (window as any)[id];
  }

  getMetrics(): AuthFlowMetrics[] {
    return [...this.metrics];
  }

  getAverageDuration(flowType?: AuthFlowMetrics['flowType']): number {
    const filteredMetrics = flowType
      ? this.metrics.filter(m => m.flowType === flowType && m.duration !== undefined)
      : this.metrics.filter(m => m.duration !== undefined);

    if (filteredMetrics.length === 0) {
      return 0;
    }

    const total = filteredMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return total / filteredMetrics.length;
  }

  getSuccessRate(flowType?: AuthFlowMetrics['flowType']): number {
    const filteredMetrics = flowType
      ? this.metrics.filter(m => m.flowType === flowType)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return 0;
    }

    const successful = filteredMetrics.filter(m => m.success).length;
    return (successful / filteredMetrics.length) * 100;
  }
}

export const perfMonitor = new PerformanceMonitor();

// Utility functions for specific flows
export const startLoginFlow = () => perfMonitor.startFlow('login');
export const endLoginFlow = (id: string, success: boolean, error?: string) =>
  perfMonitor.endFlow(id, success, error);

export const startRegistrationFlow = () => perfMonitor.startFlow('registration');
export const endRegistrationFlow = (id: string, success: boolean, error?: string) =>
  perfMonitor.endFlow(id, success, error);

export const startLogoutFlow = () => perfMonitor.startFlow('logout');
export const endLogoutFlow = (id: string, success: boolean, error?: string) =>
  perfMonitor.endFlow(id, success, error);

export const startPasswordResetFlow = () => perfMonitor.startFlow('password-reset');
export const endPasswordResetFlow = (id: string, success: boolean, error?: string) =>
  perfMonitor.endFlow(id, success, error);