import 'package:json_annotation/json_annotation.dart';

part 'point_query.g.dart';

/// Point Query
@JsonSerializable(includeIfNull: false)
class GeographyPointQuery {
  const GeographyPointQuery({required this.latitude, required this.longitude});
  final double latitude;
  final double longitude;

  factory GeographyPointQuery.fromJson(Map<String, dynamic> json) => _$GeographyPointQueryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPointQueryToJson(this);
}
