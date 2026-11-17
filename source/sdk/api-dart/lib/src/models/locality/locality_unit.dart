import 'package:json_annotation/json_annotation.dart';

part 'locality_unit.g.dart';

/// Locality Unit
@JsonSerializable(includeIfNull: false)
class LocalityLocalityUnit {
  const LocalityLocalityUnit({
    required this.code,
    required this.depth,
    required this.featureId,
    required this.kindCode,
    required this.kindLabel,
    required this.name,
  });
  final String code;
  final int depth;
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;

  factory LocalityLocalityUnit.fromJson(Map<String, dynamic> json) => _$LocalityLocalityUnitFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityLocalityUnitToJson(this);
}
