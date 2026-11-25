import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/legislature/hansards.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/legislature/sittings.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'speeches.g.dart';

/// One speech in a sitting.
@JsonSerializable(includeIfNull: false)
class LegislatureSpeeches {
  const LegislatureSpeeches({
    this.billId,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.hansardId,
    this.holderId,
    required this.id,
    required this.kindTerm,
    this.motionId,
    this.page,
    required this.position,
    required this.sittingId,
    required this.updatedAt,
    required this.version,
    this.wordCount,
  });
  final String? billId;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? hansardId;
  final String? holderId;
  final String id;
  final String kindTerm;
  final String? motionId;
  final int? page;
  final int position;
  final String sittingId;
  final DateTime updatedAt;
  final int version;
  final int? wordCount;

  factory LegislatureSpeeches.fromJson(Map<String, dynamic> json) => _$LegislatureSpeechesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureSpeechesToJson(this);
}
