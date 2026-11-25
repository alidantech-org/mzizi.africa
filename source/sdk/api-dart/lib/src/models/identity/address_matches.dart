import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/address_match.dart';

part 'address_matches.g.dart';

/// Address Matches
@JsonSerializable(includeIfNull: false)
class IdentityAddressMatches {
  const IdentityAddressMatches({required this.addresses});
  final List<IdentityAddressMatch> addresses;

  factory IdentityAddressMatches.fromJson(Map<String, dynamic> json) => _$IdentityAddressMatchesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityAddressMatchesToJson(this);
}
