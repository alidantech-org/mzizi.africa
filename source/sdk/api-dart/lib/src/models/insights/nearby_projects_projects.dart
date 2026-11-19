import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/nearby_projects_projects_media.dart';

part 'nearby_projects_projects.g.dart';

/// Nearby Projects Projects
@JsonSerializable(includeIfNull: false)
class InsightsNearbyProjectsProjects {
  const InsightsNearbyProjectsProjects({
    this.amount,
    required this.code,
    this.contractor,
    required this.distanceKm,
    required this.location,
    required this.media,
    required this.name,
    this.responsible,
    required this.status,
    required this.unit,
    required this.unitId,
    required this.unitPath,
  });
  final double? amount;
  final String code;
  final String? contractor;

  @JsonKey(name: 'distance_km')
  final double distanceKm;
  final Object? location;
  final InsightsNearbyProjectsProjectsMedia media;
  final String name;
  final String? responsible;
  final String status;
  final String unit;

  @JsonKey(name: 'unit_id')
  final String unitId;

  @JsonKey(name: 'unit_path')
  final String unitPath;

  factory InsightsNearbyProjectsProjects.fromJson(Map<String, dynamic> json) => _$InsightsNearbyProjectsProjectsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsNearbyProjectsProjectsToJson(this);
}
