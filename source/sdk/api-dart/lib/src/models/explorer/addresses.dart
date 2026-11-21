import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/address_place.dart';

part 'addresses.g.dart';

/// Addresses
@JsonSerializable(includeIfNull: false)
class ExplorerAddresses {
  const ExplorerAddresses({required this.gaps, required this.places});
  final List<String> gaps;
  final List<ExplorerAddressPlace> places;

  factory ExplorerAddresses.fromJson(Map<String, dynamic> json) => _$ExplorerAddressesFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerAddressesToJson(this);
}
