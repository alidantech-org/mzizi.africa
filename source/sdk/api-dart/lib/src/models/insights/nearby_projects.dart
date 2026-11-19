import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/nearby_projects_projects.dart';

part 'nearby_projects.g.dart';

/// Nearby Projects
@JsonSerializable(includeIfNull: false)
class InsightsNearbyProjects {
  const InsightsNearbyProjects({required this.gaps, required this.projects, required this.radiusKm});
  final List<String> gaps;
  final List<InsightsNearbyProjectsProjects> projects;
  final double radiusKm;

  factory InsightsNearbyProjects.fromJson(Map<String, dynamic> json) => _$InsightsNearbyProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsNearbyProjectsToJson(this);
}
