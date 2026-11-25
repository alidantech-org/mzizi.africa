import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'outline_window.g.dart';

/// Outline Window
@JsonSerializable(includeIfNull: false)
class GeographyOutlineWindow {
  const GeographyOutlineWindow({required this.band, required this.featureId, this.limit, this.offset});
  final int band;
  final String featureId;
  final int? limit;
  final int? offset;

  factory GeographyOutlineWindow.fromJson(Map<String, dynamic> json) => _$GeographyOutlineWindowFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyOutlineWindowToJson(this);
}
