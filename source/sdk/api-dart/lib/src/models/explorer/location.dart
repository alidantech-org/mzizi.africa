import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/context.dart';
import 'package:mzizi_api/src/models/explorer/place_group.dart';
import 'package:mzizi_api/src/models/explorer/places.dart';

part 'location.g.dart';

/// Location
@JsonSerializable(includeIfNull: false)
class ExplorerLocation {
  const ExplorerLocation({required this.context, this.found, required this.gaps, required this.groups});
  final ExplorerContext context;
  final ExplorerPlaces? found;
  final List<String> gaps;
  final List<ExplorerPlaceGroup> groups;

  factory ExplorerLocation.fromJson(Map<String, dynamic> json) => _$ExplorerLocationFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerLocationToJson(this);
}
