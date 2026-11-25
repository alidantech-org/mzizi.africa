import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/elections.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'contests.g.dart';

/// One contest in an election: one seat or one referendum question for one place.
@JsonSerializable(includeIfNull: false)
class ElectionContests {
  const ElectionContests({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.electionId,
    this.featureId,
    required this.id,
    required this.kindTerm,
    this.officeId,
    this.previousHolderId,
    this.reasonTerm,
    this.seatCount,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String electionId;
  final String? featureId;
  final String id;
  final String kindTerm;
  final String? officeId;
  final String? previousHolderId;
  final String? reasonTerm;
  final int? seatCount;
  final DateTime updatedAt;
  final int version;

  factory ElectionContests.fromJson(Map<String, dynamic> json) => _$ElectionContestsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionContestsToJson(this);
}
