import 'package:json_annotation/json_annotation.dart';

part 'project_detail_project.g.dart';

/// Project Detail Project
@JsonSerializable(includeIfNull: false)
class InsightsProjectDetailProject {
  const InsightsProjectDetailProject({
    required this.code,
    this.completedOn,
    required this.description,
    required this.location,
    required this.name,
    this.responsible,
    required this.startedOn,
    required this.status,
    required this.unit,
    required this.unitId,
    required this.unitPath,
  });
  final String code;

  @JsonKey(name: 'completed_on')
  final String? completedOn;
  final String description;
  final Object? location;
  final String name;
  final String? responsible;

  @JsonKey(name: 'started_on')
  final String startedOn;
  final String status;
  final String unit;

  @JsonKey(name: 'unit_id')
  final String unitId;

  @JsonKey(name: 'unit_path')
  final String unitPath;

  factory InsightsProjectDetailProject.fromJson(Map<String, dynamic> json) => _$InsightsProjectDetailProjectFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsProjectDetailProjectToJson(this);
}
