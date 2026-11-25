import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/politics/coalitions.dart';
import 'package:mzizi_api/src/models/politics/parties.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'alignments.g.dart';

/// A party's dated place in a coalition.
@JsonSerializable(includeIfNull: false)
class PoliticsAlignments {
  const PoliticsAlignments({
    required this.coalitionId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.kindTerm,
    required this.partyId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String coalitionId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String kindTerm;
  final String partyId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory PoliticsAlignments.fromJson(Map<String, dynamic> json) => _$PoliticsAlignmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsAlignmentsToJson(this);
}
