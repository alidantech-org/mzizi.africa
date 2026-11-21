import 'package:json_annotation/json_annotation.dart';

part 'boundary_shape.g.dart';

/// Boundary Shape
@JsonSerializable(includeIfNull: false)
class ExplorerBoundaryShape {
  const ExplorerBoundaryShape({
    required this.address,
    required this.bbox,
    required this.childCount,
    required this.geometry,
    required this.kind,
    required this.kindCode,
    required this.name,
    this.population,
  });
  final String address;
  final List<double> bbox;
  final int childCount;
  final String geometry;
  final String kind;
  final String kindCode;
  final String name;
  final double? population;

  factory ExplorerBoundaryShape.fromJson(Map<String, dynamic> json) => _$ExplorerBoundaryShapeFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerBoundaryShapeToJson(this);
}
