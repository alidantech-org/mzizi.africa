import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/site_status.dart';

part 'site_detail.g.dart';

/// Site Detail
@JsonSerializable(includeIfNull: false)
class ProductSiteDetail {
  const ProductSiteDetail({
    required this.appCode,
    required this.code,
    this.countryCode,
    this.countryId,
    required this.host,
    this.localeId,
    required this.siteId,
    required this.status,
  });
  final String appCode;
  final String code;
  final String? countryCode;
  final String? countryId;
  final String host;
  final String? localeId;
  final String siteId;
  final ProductSiteStatus status;

  factory ProductSiteDetail.fromJson(Map<String, dynamic> json) => _$ProductSiteDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ProductSiteDetailToJson(this);
}
