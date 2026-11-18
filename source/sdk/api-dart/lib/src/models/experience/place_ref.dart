import 'package:json_annotation/json_annotation.dart';

part 'place_ref.g.dart';

/// Place Ref
@JsonSerializable(includeIfNull: false)
class ExperiencePlaceRef {
  const ExperiencePlaceRef({required this.featureId, required this.kindCode, required this.kindLabel, required this.name, required this.path});
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String path;

  factory ExperiencePlaceRef.fromJson(Map<String, dynamic> json) => _$ExperiencePlaceRefFromJson(json);

  Map<String, dynamic> toJson() => _$ExperiencePlaceRefToJson(this);
}
