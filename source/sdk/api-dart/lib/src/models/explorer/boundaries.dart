import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/boundary_shape.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'boundaries.g.dart';

/// Boundaries
@JsonSerializable(includeIfNull: false)
class ExplorerBoundaries {
  const ExplorerBoundaries({required this.bbox, required this.gaps, required this.place, required this.shapes, required this.withoutBoundary});
  final List<double> bbox;
  final List<String> gaps;
  final ExplorerPlace place;
  final List<ExplorerBoundaryShape> shapes;
  final int withoutBoundary;

  factory ExplorerBoundaries.fromJson(Map<String, dynamic> json) => _$ExplorerBoundariesFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerBoundariesToJson(this);
}
