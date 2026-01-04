import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transfer {
  id: number;
  playerName: string;
  position: string;
  age: number;
  fromClub: string;
  toClub: string;
  fee: string;
  status: 'rumour' | 'in-progress' | 'completed';
  probability: number;
  type: 'incoming' | 'outgoing';
  imageUrl: string;
  date?: Date;
}

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

  ngOnInit() {
    // Load mock data immediately
    this.loadTransfers();
    this.loading = false;
  }

  loadTransfers() {
    const allTransfers = this.getMockTransfers();
    this.incomingTransfers = allTransfers.filter(t => t.type === 'incoming');
    this.outgoingTransfers = allTransfers.filter(t => t.type === 'outgoing');
  }

  getMockTransfers(): Transfer[] {
    return [
      {
        id: 1,
        playerName: 'Viktor Gyökeres',
        position: 'Striker',
        age: 26,
        fromClub: 'Sporting CP',
        toClub: 'Arsenal',
        fee: '£75M',
        status: 'rumour',
        probability: 65,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
      },
      {
        id: 2,
        playerName: 'Douglas Luiz',
        position: 'Midfielder',
        age: 26,
        fromClub: 'Juventus',
        toClub: 'Arsenal',
        fee: '£50M',
        status: 'in-progress',
        probability: 80,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80'
      },
      {
        id: 3,
        playerName: 'Benjamin Sesko',
        position: 'Striker',
        age: 21,
        fromClub: 'RB Leipzig',
        toClub: 'Arsenal',
        fee: '£55M',
        status: 'rumour',
        probability: 55,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1592913665398-c89e6d0a23c5?w=400&q=80'
      },
      {
        id: 4,
        playerName: 'Jeremie Frimpong',
        position: 'Right Back',
        age: 23,
        fromClub: 'Bayer Leverkusen',
        toClub: 'Arsenal',
        fee: '£35M',
        status: 'rumour',
        probability: 45,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80'
      },
      {
        id: 5,
        playerName: 'Eddie Nketiah',
        position: 'Striker',
        age: 25,
        fromClub: 'Arsenal',
        toClub: 'Crystal Palace',
        fee: '£30M',
        status: 'in-progress',
        probability: 75,
        type: 'outgoing',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
      },
      {
        id: 6,
        playerName: 'Kieran Tierney',
        position: 'Left Back',
        age: 27,
        fromClub: 'Arsenal',
        toClub: 'Newcastle United',
        fee: '£25M',
        status: 'rumour',
        probability: 60,
        type: 'outgoing',
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80'
      },
      {
        id: 7,
        playerName: 'Emile Smith Rowe',
        position: 'Midfielder',
        age: 24,
        fromClub: 'Arsenal',
        toClub: 'Fulham',
        fee: '£35M',
        status: 'completed',
        probability: 100,
        type: 'outgoing',
        date: new Date('2025-12-28'),
        imageUrl: 'https://images.unsplash.com/photo-1592913665398-c89e6d0a23c5?w=400&q=80'
      }
    ];
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
