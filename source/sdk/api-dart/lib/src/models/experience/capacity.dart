import 'package:json_annotation/json_annotation.dart';

part 'capacity.g.dart';

/// Capacity
@JsonSerializable(includeIfNull: false)
class ExperienceCapacity {
  const ExperienceCapacity({required this.indicatorCode, required this.label, required this.value});
  final String indicatorCode;
  final String label;
  final double value;

  factory ExperienceCapacity.fromJson(Map<String, dynamic> json) => _$ExperienceCapacityFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCapacityToJson(this);
}
