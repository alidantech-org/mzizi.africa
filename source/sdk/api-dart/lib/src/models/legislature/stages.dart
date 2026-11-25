import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'stages.g.dart';

/// A stage a bill passes through.
@JsonSerializable(includeIfNull: false)
class LegislatureStages {
  const LegislatureStages({
    required this.billId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kindTerm,
    this.motionId,
    this.onDate,
    this.outcomeTerm,
    required this.sequence,
    this.sittingId,
    required this.updatedAt,
    required this.version,
  });
  final String billId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String kindTerm;
  final String? motionId;
  final DateTime? onDate;
  final String? outcomeTerm;
  final int sequence;
  final String? sittingId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureStages.fromJson(Map<String, dynamic> json) => _$LegislatureStagesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureStagesToJson(this);
}
