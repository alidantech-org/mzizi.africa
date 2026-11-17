import 'package:json_annotation/json_annotation.dart';

part 'feature_kind.g.dart';

/// Feature Kind
@JsonSerializable(includeIfNull: false)
class GeographyFeatureKind {
  const GeographyFeatureKind({required this.code, required this.id, required this.label});
  final String code;
  final String id;
  final String label;

  factory GeographyFeatureKind.fromJson(Map<String, dynamic> json) => _$GeographyFeatureKindFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureKindToJson(this);
}
