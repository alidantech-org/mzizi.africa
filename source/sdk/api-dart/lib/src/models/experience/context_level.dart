import 'package:json_annotation/json_annotation.dart';

part 'context_level.g.dart';

/// Context Level
@JsonSerializable(includeIfNull: false)
class ExperienceContextLevel {
  const ExperienceContextLevel({required this.depth, required this.isRouting, required this.kindCode, required this.kindLabel});
  final int depth;
  final bool isRouting;
  final String kindCode;
  final String kindLabel;

  factory ExperienceContextLevel.fromJson(Map<String, dynamic> json) => _$ExperienceContextLevelFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceContextLevelToJson(this);
}
