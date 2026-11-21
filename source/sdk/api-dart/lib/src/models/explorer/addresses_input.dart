import 'package:json_annotation/json_annotation.dart';

part 'addresses_input.g.dart';

/// Addresses Input
@JsonSerializable(includeIfNull: false)
class ExplorerAddressesInput {
  const ExplorerAddressesInput({required this.addresses, this.languageCode});
  final List<String> addresses;
  final String? languageCode;

  factory ExplorerAddressesInput.fromJson(Map<String, dynamic> json) => _$ExplorerAddressesInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerAddressesInputToJson(this);
}
