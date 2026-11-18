import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/bills.dart';
import 'package:mzizi_api/src/models/governance/motions.dart';
import 'package:mzizi_api/src/models/governance/sittings.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'stages.g.dart';

/// One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication.
@JsonSerializable(includeIfNull: false)
class GovernanceStages {
  const GovernanceStages({
    required this.billId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.motionId,
    this.onDate,
    this.outcomeId,
    required this.sequenceNumber,
    this.sittingId,
    this.sourceCitationId,
    required this.stageKindId,
    required this.updatedAt,
    required this.version,
  });
  final String billId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? motionId;
  final DateTime? onDate;
  final String? outcomeId;
  final int sequenceNumber;
  final String? sittingId;
  final String? sourceCitationId;
  final String stageKindId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceStages.fromJson(Map<String, dynamic> json) => _$GovernanceStagesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceStagesToJson(this);
}
