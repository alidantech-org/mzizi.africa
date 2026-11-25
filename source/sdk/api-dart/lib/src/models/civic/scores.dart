import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/civic/score_basis.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'scores.g.dart';

/// Prepared, reviewable comparison of a contract or project with comparable prices; never a finding or accusation.
@JsonSerializable(includeIfNull: false)
class CivicScores {
  const CivicScores({
    required this.basis,
    required this.comparables,
    required this.computedAt,
    this.confidence,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    this.high,
    required this.id,
    this.low,
    this.projectId,
    this.score,
    required this.updatedAt,
    required this.version,
  });
  final CivicScoreBasis basis;
  final int comparables;
  final DateTime computedAt;
  final double? confidence;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final double? high;
  final String id;
  final double? low;
  final String? projectId;
  final double? score;
  final DateTime updatedAt;
  final int version;

  factory CivicScores.fromJson(Map<String, dynamic> json) => _$CivicScoresFromJson(json);

  Map<String, dynamic> toJson() => _$CivicScoresToJson(this);
}
