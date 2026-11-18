import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/budget_versions.dart';
import 'package:mzizi_api/src/models/finance/fiscal_periods.dart';
import 'package:mzizi_api/src/models/governance/bills.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'motions.g.dart';

/// One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns.
@JsonSerializable(includeIfNull: false)
class GovernanceMotions {
  const GovernanceMotions({
    this.billId,
    this.budgetVersionId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fiscalPeriodId,
    required this.id,
    this.instrumentId,
    required this.motionKindId,
    this.movedByHolderId,
    required this.outcomeId,
    this.provisionId,
    required this.sittingId,
    this.sourceCitationId,
    this.summary,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String? billId;
  final String? budgetVersionId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fiscalPeriodId;
  final String id;
  final String? instrumentId;
  final String motionKindId;
  final String? movedByHolderId;
  final String outcomeId;
  final String? provisionId;
  final String sittingId;
  final String? sourceCitationId;
  final String? summary;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory GovernanceMotions.fromJson(Map<String, dynamic> json) => _$GovernanceMotionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceMotionsToJson(this);
}
