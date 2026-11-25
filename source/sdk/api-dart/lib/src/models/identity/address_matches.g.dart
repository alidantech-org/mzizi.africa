// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'address_matches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityAddressMatches _$IdentityAddressMatchesFromJson(Map<String, dynamic> json) => IdentityAddressMatches(
  addresses: (json['addresses'] as List<dynamic>).map((e) => IdentityAddressMatch.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$IdentityAddressMatchesToJson(IdentityAddressMatches instance) => <String, dynamic>{'addresses': instance.addresses};
