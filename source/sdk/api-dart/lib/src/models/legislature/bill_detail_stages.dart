import 'package:json_annotation/json_annotation.dart';

part 'bill_detail_stages.g.dart';

/// Bill Detail Stages
@JsonSerializable(includeIfNull: false)
class LegislatureBillDetailStages {
  const LegislatureBillDetailStages({
    required this.kindTerm,
    this.motionId,
    this.occurrenceId,
    this.onDate,
    this.outcomeTerm,
    required this.sequence,
    this.sittingId,
  });
  final String kindTerm;
  final String? motionId;
  final String? occurrenceId;
  final DateTime? onDate;
  final String? outcomeTerm;
  final int sequence;
  final String? sittingId;

  factory LegislatureBillDetailStages.fromJson(Map<String, dynamic> json) => _$LegislatureBillDetailStagesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillDetailStagesToJson(this);
}
