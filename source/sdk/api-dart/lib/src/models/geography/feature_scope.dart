import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'feature_scope.g.dart';

/// Feature Scope
@JsonSerializable(includeIfNull: false)
class GeographyFeatureScope {
  const GeographyFeatureScope({required this.featureId, this.limit, this.offset});
  final String featureId;
  final int? limit;
  final int? offset;

  factory GeographyFeatureScope.fromJson(Map<String, dynamic> json) => _$GeographyFeatureScopeFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureScopeToJson(this);
}
