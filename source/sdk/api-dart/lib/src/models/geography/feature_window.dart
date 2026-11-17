import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'feature_window.g.dart';

/// Feature Window
@JsonSerializable(includeIfNull: false)
class GeographyFeatureWindow {
  const GeographyFeatureWindow({this.codePrefix, this.featureTypeId, this.limit, this.offset});
  final String? codePrefix;
  final String? featureTypeId;
  final int? limit;
  final int? offset;

  factory GeographyFeatureWindow.fromJson(Map<String, dynamic> json) => _$GeographyFeatureWindowFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureWindowToJson(this);
}
