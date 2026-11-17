import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'geometry_window.g.dart';

/// Geometry Window
@JsonSerializable(includeIfNull: false)
class GeographyGeometryWindow {
  const GeographyGeometryWindow({
    required this.east,
    this.featureTypeId,
    this.limit,
    required this.north,
    this.offset,
    this.simplifyTolerance,
    required this.south,
    required this.west,
    required this.zoom,
  });
  final double east;
  final String? featureTypeId;
  final int? limit;
  final double north;
  final int? offset;
  final double? simplifyTolerance;
  final double south;
  final double west;
  final int zoom;

  factory GeographyGeometryWindow.fromJson(Map<String, dynamic> json) => _$GeographyGeometryWindowFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyGeometryWindowToJson(this);
}
