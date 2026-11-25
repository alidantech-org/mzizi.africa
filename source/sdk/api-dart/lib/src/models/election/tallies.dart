import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/election/candidates.dart';
import 'package:mzizi_api/src/models/election/choices.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/election/results.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';

part 'tallies.g.dart';

/// Prepared: the one result to show per contest, option and place, chosen by the country's priorities (IEBC first).
@JsonSerializable(includeIfNull: false)
class ElectionTallies {
  const ElectionTallies({
    required this.basis,
    this.candidateId,
    this.choiceId,
    required this.contestId,
    required this.countryId,
    required this.createdAt,
    required this.featureId,
    required this.id,
    required this.refreshedAt,
    required this.resultId,
    this.share,
    required this.status,
    this.votes,
  });
  final SharedFigureBasis basis;
  final String? candidateId;
  final String? choiceId;
  final String contestId;
  final String countryId;
  final DateTime createdAt;
  final String featureId;
  final String id;
  final DateTime refreshedAt;
  final String resultId;
  final double? share;
  final SharedFigureStatus status;
  final int? votes;

  factory ElectionTallies.fromJson(Map<String, dynamic> json) => _$ElectionTalliesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionTalliesToJson(this);
}
