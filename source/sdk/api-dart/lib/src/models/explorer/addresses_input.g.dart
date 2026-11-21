// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'addresses_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerAddressesInput _$ExplorerAddressesInputFromJson(Map<String, dynamic> json) => ExplorerAddressesInput(
  addresses: (json['addresses'] as List<dynamic>).map((e) => e as String).toList(),
  languageCode: json['languageCode'] as String?,
);

Map<String, dynamic> _$ExplorerAddressesInputToJson(ExplorerAddressesInput instance) => <String, dynamic>{
  'addresses': instance.addresses,
  'languageCode': ?instance.languageCode,
};
