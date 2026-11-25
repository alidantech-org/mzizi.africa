import 'package:json_annotation/json_annotation.dart';

part 'site_key.g.dart';

/// Site Key
@JsonSerializable(includeIfNull: false)
class ProductSiteKey {
  const ProductSiteKey({required this.host});
  final String host;

  factory ProductSiteKey.fromJson(Map<String, dynamic> json) => _$ProductSiteKeyFromJson(json);

  Map<String, dynamic> toJson() => _$ProductSiteKeyToJson(this);
}
