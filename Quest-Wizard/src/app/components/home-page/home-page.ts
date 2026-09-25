import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Quest {
  title: string;
  description: string;
  reward: string;
  status: string;
}


@Component({
  selector: 'app-home-page',
  standalone: false,
  styleUrl: './home-page.scss',
  templateUrl: './home-page.html',
})
export class HomePage {

  constructor(private router: Router){};
  epicQuests: Quest[] = [
    {
      title: 'The Banishing of Smaug\'s Kin',
      description: 'Purged the northern volcanic caverns of rogue drakes, sealing the rift with high-tier runic barriers.',
      reward: '7,000 Gold Pieces & 1 Ancient Relic',
      status: 'Accomplished'
    },
    {
      title: 'Restoration of the Chrono-Hourglass',
      description: 'Mended the fractured temporal lines in the Southern Swamps, saving three centuries from folding onto themselves.',
      reward: 'Eternal Gratitude & Tier-5 Mana Crystals',
      status: 'Accomplished'
    },
    {
      title: 'Whispering Woods Dispellation',
      description: 'Exorcised the ancient phantom echo causing local villagers to speak exclusively in backward rhymes.',
      reward: '3,500 Gold Pieces',
      status: 'Accomplished'
    }
  ];

  onJoinOrder() {
    console.log('Initiating wizard trial protocols...');
  }

  onApplyAdmin() {
    console.log('Opening parchment application for administrative scribes...');
    this.router.navigate(['/register', "tower"]);
  }
}
