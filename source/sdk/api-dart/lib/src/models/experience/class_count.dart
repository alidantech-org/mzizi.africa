import 'package:json_annotation/json_annotation.dart';

part 'class_count.g.dart';

/// Class Count
@JsonSerializable(includeIfNull: false)
class ExperienceClassCount {
  const ExperienceClassCount({required this.code, required this.count, required this.label, this.parentCode});
  final String code;
  final int count;
  final String label;
  final String? parentCode;

  factory ExperienceClassCount.fromJson(Map<String, dynamic> json) => _$ExperienceClassCountFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceClassCountToJson(this);
}
