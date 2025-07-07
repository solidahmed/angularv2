import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

export interface ChartOptions {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  data: any[];
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartRendererService {
  
  constructor() {}
  
  async renderChart(canvas: HTMLCanvasElement, options: ChartOptions): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Improve text rendering
    ctx.textBaseline = 'middle';
    ctx.imageSmoothingEnabled = true;
    
    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(options.title, canvas.width / 2, 30);
    
    // Prepare chart data
    const chartData = this.prepareChartData(options);
    
    // Create chart
    new Chart(ctx, {
      type: options.type as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: options.title
          }
        }
      }
    });
  }
  
  private prepareChartData(options: ChartOptions): ChartData {
    const colors = [
      '#70CDFF', '#39A8F7', '#0C75D1', '#C474F2', '#042C75',
      '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
    ];
    
    switch (options.type) {
      case 'bar':
        return {
          labels: options.data.map(item => item.name || item.label),
          datasets: [{
            label: 'Value',
            data: options.data.map(item => item.value),
            backgroundColor: options.data.map((_, i) => colors[i % colors.length]),
            borderColor: options.data.map((_, i) => colors[i % colors.length]),
            borderWidth: 1
          }]
        };
        
      case 'line':
        return {
          labels: options.data.map(item => item.name || item.label),
          datasets: [{
            label: 'Value',
            data: options.data.map(item => item.value),
            fill: false,
            borderColor: colors[0],
            tension: 0.1
          }]
        };
        
      case 'pie':
      case 'doughnut':
        return {
          labels: options.data.map(item => item.name || item.label),
          datasets: [{
            data: options.data.map(item => item.value),
            backgroundColor: options.data.map((_, i) => colors[i % colors.length]),
            hoverOffset: 4
          }]
        };
        
      default:
        return { datasets: [] };
    }
  }
  
  async exportChartAsImage(canvas: HTMLCanvasElement): Promise<string> {
    return canvas.toDataURL('image/png');
  }
}