import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/election/candidates.dart';
import 'package:mzizi_api/src/models/election/choices.dart';
import 'package:mzizi_api/src/models/election/forms.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';

part 'results.g.dart';

/// Votes for exactly one candidate or one choice in one place, by collection and revision.
@JsonSerializable(includeIfNull: false)
class ElectionResults {
  const ElectionResults({
    required this.basis,
    this.candidateId,
    this.choiceId,
    this.collectionId,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    this.formId,
    required this.id,
    required this.revision,
    required this.status,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
    this.votes,
  });
  final SharedFigureBasis basis;
  final String? candidateId;
  final String? choiceId;
  final String? collectionId;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String? formId;
  final String id;
  final int revision;
  final SharedFigureStatus status;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;
  final int? votes;

  factory ElectionResults.fromJson(Map<String, dynamic> json) => _$ElectionResultsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionResultsToJson(this);
}
