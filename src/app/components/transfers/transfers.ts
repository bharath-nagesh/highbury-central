import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballData, Transfer } from '../../services/football-data';

@Component({
  selector: 'app-transfers',
  imports: [CommonModule],
  templateUrl: './transfers.html',
  styleUrl: './transfers.scss',
})
export class Transfers implements OnInit {
  incomingTransfers: Transfer[] = [];
  outgoingTransfers: Transfer[] = [];
  activeTab: 'incoming' | 'outgoing' = 'incoming';
  loading = true;

  constructor(private footballData: FootballData) {}

  ngOnInit() {
    // Load data from service
    this.footballData.getTransfers().subscribe({
      next: (transfers) => {
        this.loadTransfers(transfers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transfers:', error);
        this.loading = false;
      }
    });
  }

  loadTransfers(allTransfers: Transfer[]) {
    this.incomingTransfers = allTransfers.filter(t => t.type === 'incoming');
    this.outgoingTransfers = allTransfers.filter(t => t.type === 'outgoing');
  }

  setActiveTab(tab: 'incoming' | 'outgoing') {
    this.activeTab = tab;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'rumour': '#FFB800',
      'in-progress': '#00D9FF',
      'completed': '#00D084'
    };
    return colors[status] || '#9C824A';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'rumour': 'Rumoured',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  }

  getProbabilityColor(probability: number): string {
    if (probability >= 75) return '#00D084';
    if (probability >= 50) return '#FFB800';
    return '#FF3B30';
  }
}
