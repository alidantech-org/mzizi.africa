import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/geography_api.dart';
import '../theme/app_colors.dart';

class BoundaryEvidenceSheet extends StatelessWidget {
  const BoundaryEvidenceSheet({
    super.key,
    required this.place,
    this.geometryAvailable,
  });

  final GeographyEntity place;
  final bool? geometryAvailable;

  static Future<void> show(
    BuildContext context,
    GeographyEntity place, {
    bool? geometryAvailable,
  }) => showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
    ),
    builder: (_) => BoundaryEvidenceSheet(
      place: place,
      geometryAvailable: geometryAvailable,
    ),
  );

  @override
  Widget build(BuildContext context) {
    final metadata = place.boundaryMetadata;
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(20, 16, 20, 20 + bottomInset),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: Container(
                  width: 38,
                  height: 4,
                  decoration: BoxDecoration(
                    color: context.colors.outlineVariant,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Boundary evidence',
                style: TextStyle(
                  color: context.colors.onSurface,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                place.displayName,
                style: TextStyle(
                  color: context.colors.onSurfaceVariant,
                  fontSize: 15,
                ),
              ),
              const SizedBox(height: 14),
              _verificationStatus(context, metadata.verified),
              _field(
                context,
                'Geometry in this map view',
                geometryAvailable == null
                    ? 'Not loaded'
                    : geometryAvailable!
                    ? 'Available and verified'
                    : 'Unavailable or not verified',
              ),
              const SizedBox(height: 16),
              _field(context, 'Source', metadata.source),
              _referenceField(context, metadata.sourceReference),
              _field(context, 'Citation', metadata.citation),
              _field(context, 'License', metadata.license),
              _field(context, 'Reference year', metadata.referenceYear),
              _field(context, 'Retrieved at', metadata.retrievedAt),
              _field(context, 'Valid from', metadata.validFrom),
              _field(context, 'Valid to', metadata.validTo),
              _field(context, 'Boundary version', metadata.version),
              _field(context, 'Dataset version', metadata.datasetVersion),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).maybePop(),
                  child: const Text('Close'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _verificationStatus(BuildContext context, bool verified) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: verified
          ? context.colors.primaryContainer
          : context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          verified ? Icons.verified_outlined : Icons.info_outline,
          size: 20,
          color: verified
              ? context.colors.primary
              : context.colors.onSurfaceVariant,
        ),
        const SizedBox(width: 9),
        Expanded(
          child: Text(
            verified ? 'The Mzizi API marks this boundary record as verified.' : 'The Mzizi API does not mark this boundary record as verified.',
            style: TextStyle(
              color: context.colors.onSurface,
              fontSize: 14,
              height: 1.35,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    ),
  );

  Widget _field(BuildContext context, String label, String? value) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: context.colors.onSurfaceVariant,
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 3),
        SelectableText(
          _displayValue(value),
          style: TextStyle(
            color: context.colors.onSurface,
            fontSize: 14.5,
            height: 1.35,
          ),
        ),
      ],
    ),
  );

  Widget _referenceField(BuildContext context, String? reference) {
    if (reference == null || reference.trim().isEmpty) {
      return _field(context, 'Source reference', null);
    }
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Source reference',
            style: TextStyle(
              color: context.colors.onSurfaceVariant,
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 3),
          SelectableText(
            reference,
            style: TextStyle(
              color: context.colors.primary,
              fontSize: 14,
              height: 1.35,
              decoration: TextDecoration.underline,
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton.icon(
              onPressed: () async {
                await Clipboard.setData(ClipboardData(text: reference));
                if (!context.mounted) return;
                ScaffoldMessenger.maybeOf(context)?.showSnackBar(
                  const SnackBar(content: Text('Source reference copied')),
                );
              },
              icon: const Icon(Icons.copy_outlined, size: 16),
              label: const Text('Copy reference'),
            ),
          ),
        ],
      ),
    );
  }

  String _displayValue(String? value) =>
      value == null || value.trim().isEmpty ? 'Not recorded' : value;
}
