import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_civic_projects_media.dart';

part 'place_civic_projects.g.dart';

/// Place Civic Projects
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicProjects {
  const InsightsPlaceCivicProjects({
    this.amount,
    required this.code,
    this.completedOn,
    this.contractor,
    this.location,
    required this.media,
    required this.name,
    required this.startedOn,
    required this.status,
    required this.unit,
    required this.unitId,
    required this.unitPath,
  });
  final double? amount;
  final String code;

  @JsonKey(name: 'completed_on')
  final String? completedOn;
  final String? contractor;
  final Object? location;
  final InsightsPlaceCivicProjectsMedia media;
  final String name;

  @JsonKey(name: 'started_on')
  final String startedOn;
  final String status;
  final String unit;

  @JsonKey(name: 'unit_id')
  final String unitId;

  @JsonKey(name: 'unit_path')
  final String unitPath;

  factory InsightsPlaceCivicProjects.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicProjectsToJson(this);
}
