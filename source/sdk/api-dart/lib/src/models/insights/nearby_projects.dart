import 'package:json_annotation/json_annotation.dart';

part 'nearby_projects.g.dart';

/// Nearby Projects
@JsonSerializable(includeIfNull: false)
class InsightsNearbyProjects {
  const InsightsNearbyProjects({required this.gaps, required this.projects, required this.radiusKm});
  final List<String> gaps;
  final List<Object?> projects;
  final double radiusKm;

  factory InsightsNearbyProjects.fromJson(Map<String, dynamic> json) => _$InsightsNearbyProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsNearbyProjectsToJson(this);
}
