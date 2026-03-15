import { PartialType } from '@nestjs/swagger';

import { CreateWatchRuleDto } from './create-watch-rule.dto';

export class UpdateWatchRuleDto extends PartialType(CreateWatchRuleDto) {}
