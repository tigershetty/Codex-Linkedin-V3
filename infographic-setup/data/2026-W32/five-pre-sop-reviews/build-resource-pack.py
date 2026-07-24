"""Compatibility entrypoint for the individual-download resource builder.

The public resource is no longer packaged as a ZIP. Keep this filename so old
workflow notes still run, but delegate to the transparent resource library.
"""

from build_resource_library import build


if __name__ == "__main__":
    build()
