import { Injectable } from '@nestjs/common';

import { PlansRepository } from './plans.repository';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  getPlans() {
    return this.plansRepository.findAll();
  }
}
