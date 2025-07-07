import { Injectable } from '@angular/core';

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'donut';
  title: string;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartRendererService {
  constructor() { }

  private createCanvas(width: number = 1200, height: number = 800): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    // Use device pixel ratio for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    return canvas;
  }

  async renderChart(chartData: ChartData): Promise<string> {
    return new Promise((resolve) => {
      const canvas = this.createCanvas();
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('');
        return;
      }

      // Set white background with better quality
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      // Improve text rendering
      ctx.textBaseline = 'middle';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw title with better positioning
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(chartData.title, 600, 50);

      const chartArea = {
        x: 120,
        y: 100,
        width: 960,
        height: 580
      };

      switch (chartData.type) {
        case 'bar':
          this.drawBarChart(ctx, chartData.data, chartArea);
          break;
        case 'line':
          this.drawLineChart(ctx, chartData.data, chartArea);
          break;
        case 'pie':
        case 'donut':
          this.drawPieChart(ctx, chartData.data, chartArea, chartData.type === 'donut');
          break;
      }

      // Add subtle border for better presentation
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 1180, 780);

      // Convert to high-quality base64
      const dataURL = canvas.toDataURL('image/png', 1.0);
      resolve(dataURL);
    });
  }

  private drawBarChart(ctx: CanvasRenderingContext2D, data: any[], area: any) {
    const colors = ['#70CDFF', '#39A8F7', '#0C75D1', '#C474F2', '#042C75'];
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (area.width / data.length) * 0.7;
    const barSpacing = (area.width / data.length) * 0.3;

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = area.y + (area.height * i / 5);
      ctx.beginPath();
      ctx.moveTo(area.x, y);
      ctx.lineTo(area.x + area.width, y);
      ctx.stroke();
    }

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * area.height * 0.8;
      const x = area.x + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = area.y + area.height - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      const baseColor = colors[index % colors.length];
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, baseColor + '80');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value label
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 16px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 15);

      // Draw name label
      ctx.font = '14px Inter, Arial, sans-serif';
      ctx.fillText(item.name, x + barWidth / 2, area.y + area.height + 30);
    });

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue * i / 5).toFixed(0);
      const y = area.y + area.height - (area.height * i / 5);
      ctx.fillText(value, area.x - 10, y);
    }
  }

  private drawLineChart(ctx: CanvasRenderingContext2D, data: any[], area: any) {
    const maxValue = Math.max(...data.map(d => d.value));
    const points: Array<{x: number, y: number}> = [];

    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = area.y + (area.height * i / 5);
      ctx.beginPath();
      ctx.moveTo(area.x, y);
      ctx.lineTo(area.x + area.width, y);
      ctx.stroke();
    }

    // Calculate points
    data.forEach((item, index) => {
      const x = area.x + (index / (data.length - 1)) * area.width;
      const y = area.y + area.height - (item.value / maxValue) * area.height * 0.8;
      points.push({ x, y });
    });

    // Draw line with gradient
    const gradient = ctx.createLinearGradient(0, area.y, 0, area.y + area.height);
    gradient.addColorStop(0, '#39A8F7');
    gradient.addColorStop(1, '#0C75D1');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw points and labels
    points.forEach((point, index) => {
      // Draw point
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#0C75D1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 14px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data[index].value.toString(), point.x, point.y - 20);
      ctx.font = '12px Inter, Arial, sans-serif';
      ctx.fillText(data[index].name, point.x, area.y + area.height + 30);
    });
  }

  private drawPieChart(ctx: CanvasRenderingContext2D, data: any[], area: any, isDonut: boolean = false) {
    const colors = ['#70CDFF', '#39A8F7', '#0C75D1', '#C474F2', '#042C75'];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = area.x + area.width / 2;
    const centerY = area.y + area.height / 2;
    const radius = Math.min(area.width, area.height) / 2 * 0.7;
    const innerRadius = isDonut ? radius * 0.4 : 0;

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      // Draw slice with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + 'CC');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Add subtle border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw inner circle for donut
      if (isDonut) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw percentage label
      if (sliceAngle > 0.2) { // Only show label if slice is large enough
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * (isDonut ? 0.7 : 0.6);
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        const percentage = ((item.value / total) * 100).toFixed(1);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(`${percentage}%`, labelX, labelY);
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }

      currentAngle += sliceAngle;
    });

    // Draw legend with better positioning
    const legendX = area.x + area.width + 40;
    let legendY = area.y + 40;
    
    ctx.font = 'bold 16px Inter, Arial, sans-serif';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText('Legend', legendX, legendY);
    legendY += 30;
    
    data.forEach((item, index) => {
      const color = colors[index % colors.length];
      
      // Legend color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY - 8, 20, 16);
      
      // Legend text
      ctx.fillStyle = '#374151';
      ctx.font = '14px Inter, Arial, sans-serif';
      ctx.fillText(`${item.name} (${item.value})`, legendX + 30, legendY);
      
      legendY += 30;
    });
  }
}