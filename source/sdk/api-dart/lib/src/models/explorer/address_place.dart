import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'address_place.g.dart';

/// Address Place
@JsonSerializable(includeIfNull: false)
class ExplorerAddressPlace {
  const ExplorerAddressPlace({required this.address, this.place});
  final String address;
  final ExplorerPlace? place;

  factory ExplorerAddressPlace.fromJson(Map<String, dynamic> json) => _$ExplorerAddressPlaceFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerAddressPlaceToJson(this);
}
