import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/politics/parties.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'candidates.g.dart';

/// A person standing in a contest.
@JsonSerializable(includeIfNull: false)
class ElectionCandidates {
  const ElectionCandidates({
    this.ballotOrder,
    required this.code,
    required this.contestId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.individualId,
    required this.kindTerm,
    this.partyId,
    required this.updatedAt,
    required this.version,
  });
  final int? ballotOrder;
  final String code;
  final String contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String individualId;
  final String kindTerm;
  final String? partyId;
  final DateTime updatedAt;
  final int version;

  factory ElectionCandidates.fromJson(Map<String, dynamic> json) => _$ElectionCandidatesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionCandidatesToJson(this);
}
