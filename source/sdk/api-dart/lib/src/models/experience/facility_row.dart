import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/capacity.dart';

part 'facility_row.g.dart';

/// Facility Row
@JsonSerializable(includeIfNull: false)
class ExperienceFacilityRow {
  const ExperienceFacilityRow({
    required this.capacity,
    required this.classCode,
    required this.classLabel,
    required this.code,
    required this.domainCode,
    required this.domainLabel,
    required this.featureId,
    this.latitude,
    this.longitude,
    required this.name,
    this.operator,
    this.ownershipLabel,
    this.placeName,
    this.placePath,
    required this.statusLabel,
  });
  final List<ExperienceCapacity> capacity;
  final String classCode;
  final String classLabel;
  final String code;
  final String domainCode;
  final String domainLabel;
  final String featureId;
  final double? latitude;
  final double? longitude;
  final String name;
  final String? operator;
  final String? ownershipLabel;
  final String? placeName;
  final String? placePath;
  final String statusLabel;

  factory ExperienceFacilityRow.fromJson(Map<String, dynamic> json) => _$ExperienceFacilityRowFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceFacilityRowToJson(this);
}
