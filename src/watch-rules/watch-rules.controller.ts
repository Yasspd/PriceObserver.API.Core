import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateWatchRuleDto } from './dto/create-watch-rule.dto';
import { QueryWatchRulesDto } from './dto/query-watch-rules.dto';
import { UpdateWatchRuleDto } from './dto/update-watch-rule.dto';
import { WatchRulesService } from './watch-rules.service';

@ApiTags('watch-rules')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('watch-rules')
export class WatchRulesController {
  constructor(private readonly watchRulesService: WatchRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a watch rule for a product' })
  @ApiCreatedResponse()
  createWatchRule(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateWatchRuleDto,
  ) {
    return this.watchRulesService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user watch rules' })
  @ApiOkResponse()
  getWatchRules(
    @CurrentUser() user: { userId: string },
    @Query() query: QueryWatchRulesDto,
  ) {
    return this.watchRulesService.findAll(user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single watch rule' })
  @ApiOkResponse()
  getWatchRule(
    @CurrentUser() user: { userId: string },
    @Param('id') watchRuleId: string,
  ) {
    return this.watchRulesService.findById(user.userId, watchRuleId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a watch rule' })
  @ApiOkResponse()
  updateWatchRule(
    @CurrentUser() user: { userId: string },
    @Param('id') watchRuleId: string,
    @Body() dto: UpdateWatchRuleDto,
  ) {
    return this.watchRulesService.update(user.userId, watchRuleId, dto);
  }
}
