import 'package:json_annotation/json_annotation.dart';

part 'place_civic_infrastructure.g.dart';

/// Place Civic Infrastructure
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicInfrastructure {
  const InsightsPlaceCivicInfrastructure({
    this.areaKm2,
    required this.completed,
    this.completionRate,
    this.per100k,
    this.perKm2,
    this.population,
    this.projectShare,
    required this.projects,
    this.staffShare,
  });
  final double? areaKm2;
  final double completed;
  final double? completionRate;
  final double? per100k;
  final double? perKm2;
  final double? population;
  final double? projectShare;
  final double projects;
  final double? staffShare;

  factory InsightsPlaceCivicInfrastructure.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicInfrastructureFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicInfrastructureToJson(this);
}
