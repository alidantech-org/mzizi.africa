import 'package:json_annotation/json_annotation.dart';
import 'page_window.dart';

part 'feature_window.g.dart';

/// Feature Window
@JsonSerializable(includeIfNull: false)
class FeatureWindow {
  const FeatureWindow({
    this.codePrefix,
    this.featureTypeId,
    this.limit,
    this.offset,
  });
  final String? codePrefix;
  final String? featureTypeId;
  final int? limit;
  final int? offset;

  factory FeatureWindow.fromJson(Map<String, dynamic> json) => _$FeatureWindowFromJson(json);

  Map<String, dynamic> toJson() => _$FeatureWindowToJson(this);
}