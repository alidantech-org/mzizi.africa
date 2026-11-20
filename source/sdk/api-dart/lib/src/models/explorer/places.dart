import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'places.g.dart';

/// Places
@JsonSerializable(includeIfNull: false)
class ExplorerPlaces {
  const ExplorerPlaces({required this.gaps, required this.limit, required this.page, required this.places, required this.total});
  final List<String> gaps;
  final int limit;
  final int page;
  final List<ExplorerPlace> places;
  final int total;

  factory ExplorerPlaces.fromJson(Map<String, dynamic> json) => _$ExplorerPlacesFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerPlacesToJson(this);
}
