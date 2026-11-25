import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'address_key.g.dart';

/// Address Key
@JsonSerializable(includeIfNull: false)
class IdentityAddressKey {
  const IdentityAddressKey({this.countryId, this.limit, this.offset, required this.segment});
  final String? countryId;
  final int? limit;
  final int? offset;
  final String segment;

  factory IdentityAddressKey.fromJson(Map<String, dynamic> json) => _$IdentityAddressKeyFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityAddressKeyToJson(this);
}
